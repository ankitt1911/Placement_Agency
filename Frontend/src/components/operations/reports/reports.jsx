import { handleExportReports, handleGetReports } from "../../../Services/apiCalling/reportApis";
import OperationsList from "../shared/OperationsList";

export default function Reports() {
  return (
    <OperationsList
      title="Reports"
      searchPlaceholder="Search report type or title"
      fetchItems={handleGetReports}
      searchKeys={["type", "title", "value"]}
      columns={[{ key: "type", label: "Report Type" }, { key: "title", label: "Summary" }, { key: "value", label: "Value" }]}
      filterConfig={[{ key: "type", label: "Type", options: ["Student", "Application", "Opening"] }]}
      exportAction={handleExportReports}
      rowDetail={(row) => row ? Object.entries(row).map(([key, value]) => <p key={key}><b>{key}:</b> {String(value)}</p>) : null}
    />
  );
}
