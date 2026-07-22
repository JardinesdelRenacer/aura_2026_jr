import { getActiveObituaries } from "@/src/repositories/obituaryRepository";

export async function listActiveObituaries() {
    return await getActiveObituaries();
    
}