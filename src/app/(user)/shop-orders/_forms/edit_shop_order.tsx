import { ShopOrder } from "@/types/collections";
import ShopOrderForm from "@/app/(user)/shop-orders/_forms/shop_order_form";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

type Props = {
    shopOrder: ShopOrder;
}

export default function EditShopOrder({ shopOrder }: Props) {
    return (
        <ShopOrderForm shopOrder={shopOrder}>
            <Button variant='secondary' className="py-4 px rounded-sm border text-base font-bold">
                <div className="flex items-center space-x-2">
                    <PencilIcon size={20} />
                    <span>Edit</span>
                </div>
            </Button>
        </ShopOrderForm>
    )
}