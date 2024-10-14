'use client'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userKeys } from "@/lib/query_keys";
import { getUsers } from "@/server/users/get_users";
import { useQuery } from "@tanstack/react-query";
import User from './user';

export default function Users() {

    const { data: users, isError, isPending } = useQuery({
        queryKey: userKeys.all,
        queryFn: () => getUsers(),
    });

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;

    return (
        <div className="p-6 overflow-y-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <User key={user._id} user={user} />
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}