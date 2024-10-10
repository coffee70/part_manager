import { CustomerOrder, Section, Field } from "@/types/collections";
import CustomerOrderForm from "./customer_order_form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

type Props = {
    customerOrder: CustomerOrder;
}

export default function EditCustomerOrder({ customerOrder }: Props) {
    return (
        <CustomerOrderForm customerOrder={customerOrder}>
            <Button variant='secondary' className="py-4 px rounded-sm border text-base font-bold">
                <div className="flex items-center space-x-2">
                    <PencilIcon size={20} />
                    <span>Edit</span>
                </div>
            </Button>
        </CustomerOrderForm>
    )
}