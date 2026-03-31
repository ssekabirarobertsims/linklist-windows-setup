import { useEffect, useState } from "react";
import { BarChart, XAxis, YAxis, Tooltip, Bar } from "recharts";

// Define the shape of a saved link item
type ListItemProperties = {
  id: string;
  title: string;
  link: string;
  user_id: string;
  date_created?: string;
  _date?: string;
  description?: string;
};

// Transform linksList data into chart format
const transformLinksToChartData = (links: ListItemProperties[]) => {
  const dateCountMap: { [key: string]: number } = {};

  // Count links per date
  links.forEach((link) => {
    if (link._date) {
      // Extract date from format "Thu, December 4, 2025" -> "December 4, 2025"
      const dateString = link._date.split(", ").slice(1).join(", ");
      dateCountMap[dateString] = (dateCountMap[dateString] || 0) + 1;
    }
  });

  // Convert to chart format
  return Object.entries(dateCountMap)
    .map(([date, count]) => ({
      date: date,
      links: count,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
const LinksBarGraphChartComponent = ({ isAnimationActive = true }) => {
  // State for all links, search results, search value, and selected link for editing
  // Initialize state for the list of links, search results, search value, and selected link
  // State to hold the list of links
  const [linksList, setLinksList] = useState<ListItemProperties[]>(
    [] as ListItemProperties[]
  );

  // State to hold transformed chart data
  const [chartData, setChartData] = useState<{ date: string; links: number }[]>(
    []
  );

  // fetch all existing links on component mount and display them
  useEffect(() => {
    const fetchLinks = async (): Promise<ListItemProperties[]> => {
      const links: ListItemProperties[] =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (await window.app_api.readAllExistingLinks()) as ListItemProperties[];
      // set the links list state
      setLinksList(links);
      // return an arr[] for the links
      return links;
    };

    fetchLinks();
  }, []);

  // Transform links to chart data whenever linksList changes
  useEffect(() => {
    const transformed = transformLinksToChartData(linksList);
    setChartData(transformed);
  }, [linksList]);

  return (
    <BarChart
      style={{
        width: "100%",
        maxHeight: "17em",
        aspectRatio: 1.618,
      }}
      responsive
      data={chartData}
      margin={{
        top: 20,
        right: 20,
        bottom: 20,
        left: 20,
      }}
    >
      <XAxis dataKey="date" />
      <YAxis width="auto" />
      <Tooltip />
      <Bar
        dataKey="links"
        fill="#8884d8"
        width={10}
        radius={[10, 10, 0, 0]}
        minPointSize={5}
        isAnimationActive={isAnimationActive}
      />
    </BarChart>
  );
};

export default LinksBarGraphChartComponent;
