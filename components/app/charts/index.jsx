import BarChart from "./BarChart";
import LineChart from "./LineChart";

export const ChartBuilder = ({chartType = "bar", ...props}) => {
    switch (chartType) {
        case "bar": return <BarChart {...props} />;
        case "line": return <LineChart {...props} />;
    }
}