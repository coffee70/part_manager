'use client'
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { userKeys } from "@/lib/query_keys";
import { getUsers } from "@/server/users/get_users";
import { useQuery } from "@tanstack/react-query";
import User from './user';
import { AppBar } from "@/components/ui/app_bar";
import { PageTitle } from "@/components/ui/page_title";
import { SecondaryUserIcon } from "@/components/ui/icons/icons";
import CreateUser from "./create_user";

export default function Users() {

    const { data: users, isError, isPending } = useQuery({
        queryKey: userKeys.all(),
        queryFn: () => getUsers(),
    });

    if (isPending) return <div>Loading...</div>;
    if (isError) return <div>Error...</div>;
    if (!users) return <div>Error...</div>

    return (
        <div className="flex flex-col w-full h-full">
            <AppBar>
                <PageTitle
                    icon={<SecondaryUserIcon size={50} />}
                    title="Users"
                />
                <CreateUser />
            </AppBar>
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
        </div>
    )
}