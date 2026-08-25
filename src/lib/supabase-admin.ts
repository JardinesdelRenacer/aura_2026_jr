import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const serviceRoleRey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY no esta configurada."
    );
}

if (!serviceRoleRey) {throw new Error(
    "SUPABASE_SERVICE_ROLE_REY no esta configurada."
    );
} 

export const supabaseAdmin = createClient(
    supabaseUrl,
    serviceRoleRey,
    { auth: { persistSession: false, autoRefreshToken: false }}
);