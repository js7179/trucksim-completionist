import { adminAuthClient } from "../supabase";

export default async function cleanupSupabaseUser(email: string) {
    const { data: { users }, error: listError } = await adminAuthClient.listUsers();
    if(listError) throw listError;
    const preexistingUser = users.filter((user) => user.email === email);
    if(preexistingUser.length !== 0) {
        preexistingUser.forEach(async (user) => {
            const { error } = await adminAuthClient.deleteUser(user.id);
            if(error) throw error;
        });
    }
}