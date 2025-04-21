import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js";
import { createHmac } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface VirtualNumber {
  id: string;
  bookingId: string;
  virtualNumber: string;
  realDriverNumber: string;
  realCustomerNumber: string;
  expiresAt: Date;
  isActive: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { action, bookingId, phoneNumber, userType } = await req.json();

    switch (action) {
      case 'generate':
        return await handleNumberGeneration(supabase, bookingId);
      case 'connect':
        return await handleCallConnection(supabase, bookingId, phoneNumber, userType);
      case 'expire':
        return await handleNumberExpiration(supabase, bookingId);
      case 'verify':
        return await handleCallVerification(supabase, bookingId);
      default:
        throw new Error('Invalid action');
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});

async function handleNumberGeneration(supabase: any, bookingId: string) {
  // Get booking details
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select(`
      id,
      user_id,
      route_id,
      routes (
        vehicle_id,
        vehicles (
          driver_id
        )
      )
    `)
    .eq('id', bookingId)
    .single();

  if (bookingError) throw bookingError;

  // Generate virtual number (using a deterministic algorithm)
  const virtualNumber = generateVirtualNumber(bookingId);

  // Store virtual number mapping
  const { data, error } = await supabase
    .from('virtual_numbers')
    .insert({
      booking_id: bookingId,
      virtual_number: virtualNumber,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      is_active: true
    })
    .select()
    .single();

  if (error) throw error;

  return new Response(
    JSON.stringify({ virtualNumber: data.virtual_number }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function handleCallConnection(
  supabase: any,
  bookingId: string,
  phoneNumber: string,
  userType: 'driver' | 'customer'
) {
  // Verify booking status and payment
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('status, payment_status')
    .eq('id', bookingId)
    .single();

  if (bookingError) throw bookingError;

  if (booking.payment_status !== 'paid') {
    throw new Error('Payment must be completed before enabling calls');
  }

  // Get active virtual number
  const { data: virtualNumber, error: virtualNumberError } = await supabase
    .from('virtual_numbers')
    .select('*')
    .eq('booking_id', bookingId)
    .eq('is_active', true)
    .single();

  if (virtualNumberError) throw virtualNumberError;

  // Verify call is within allowed timeframe
  if (new Date(virtualNumber.expires_at) < new Date()) {
    throw new Error('Virtual number has expired');
  }

  // Log call attempt for monitoring
  await supabase
    .from('call_logs')
    .insert({
      virtual_number_id: virtualNumber.id,
      caller_type: userType,
      caller_number: phoneNumber,
      status: 'initiated'
    });

  return new Response(
    JSON.stringify({ 
      success: true,
      virtualNumber: virtualNumber.virtual_number
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function handleNumberExpiration(supabase: any, bookingId: string) {
  const { error } = await supabase
    .from('virtual_numbers')
    .update({
      is_active: false,
      expires_at: new Date()
    })
    .eq('booking_id', bookingId);

  if (error) throw error;

  return new Response(
    JSON.stringify({ success: true }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

async function handleCallVerification(supabase: any, bookingId: string) {
  // Get call logs for analysis
  const { data: callLogs, error: callLogsError } = await supabase
    .from('call_logs')
    .select('*')
    .eq('virtual_number.booking_id', bookingId);

  if (callLogsError) throw callLogsError;

  // Perform AI-based analysis
  const analysis = await analyzeCallPatterns(callLogs);

  if (analysis.isSuspicious) {
    // Log suspicious activity
    await supabase
      .from('security_alerts')
      .insert({
        booking_id: bookingId,
        alert_type: 'suspicious_call_pattern',
        details: analysis.details
      });
  }

  return new Response(
    JSON.stringify({ 
      isValid: !analysis.isSuspicious,
      details: analysis.details
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

function generateVirtualNumber(bookingId: string): string {
  // Create a deterministic but secure virtual number
  const hash = createHmac('sha256', Deno.env.get('VIRTUAL_NUMBER_SECRET') ?? '')
    .update(bookingId)
    .digest('hex');
  
  // Format as a phone number (e.g., +91-XXXXXXXXXX)
  return `+91${hash.slice(0, 10)}`;
}

async function analyzeCallPatterns(callLogs: any[]): Promise<{ isSuspicious: boolean; details: string }> {
  // Implement AI-based pattern analysis
  const suspiciousPatterns = {
    excessiveCalls: callLogs.length > 10,
    oddHourCalls: callLogs.some(log => {
      const hour = new Date(log.created_at).getHours();
      return hour < 6 || hour > 22;
    }),
    rapidSuccession: callLogs.some((log, i) => {
      if (i === 0) return false;
      const timeDiff = new Date(log.created_at).getTime() - 
                      new Date(callLogs[i-1].created_at).getTime();
      return timeDiff < 60000; // Less than 1 minute apart
    })
  };

  const isSuspicious = Object.values(suspiciousPatterns).some(Boolean);
  const details = Object.entries(suspiciousPatterns)
    .filter(([_, isTrue]) => isTrue)
    .map(([pattern]) => pattern)
    .join(', ');

  return {
    isSuspicious,
    details: details || 'No suspicious patterns detected'
  };
}