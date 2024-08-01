import SplitPane from "@/components/split_pane/split_pane"
import TableContainer from "./table_container";
import SummaryContainer from "./summary_container";

export default function CustomerOrders() {

    return (
        <SplitPane
            leftPaneSlot={ <TableContainer /> }
            rightPaneSlot={ <SummaryContainer /> }
        />
    );
}