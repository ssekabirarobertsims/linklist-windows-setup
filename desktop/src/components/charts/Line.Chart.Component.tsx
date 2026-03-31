// import React from "react";

// // Define the shape of a trashed link item
// type ListItemProperties = {
//   id: string;
//   title: string;
//   link: string;
//   user_id: string;
//   date_created: string;
// };

// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   // Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
//   Legend,
// } from "recharts";

// interface data {
//   saved_links: ListItemProperties[];
// }

// const LineChartComponent: React.FunctionComponent<data> = ({ saved_links }) => {
//   // Group links by date and count them for charting
//   const chartData = React.useMemo(() => {
//     const counts: { [date: string]: number } = {};

//     saved_links?.forEach((item) => {
//       // Format the date as 'Mon DD'
//       const date = new Date(item.date_created).toLocaleDateString("en-US", {
//         month: "short",
//         day: "numeric",
//       });
//       counts[date] = (counts[date] || 0) + 1;
//     });
//     // Convert to array for recharts
//     return Object.entries(counts).map(([date, links]) => ({ date, links }));
//   }, [saved_links]);

//   // Render the responsive line chart with the processed data
//   return (
//     <div className="chart-container">
//       <ResponsiveContainer width="100%" height="100%">
//         <LineChart
//           data={chartData}
//           margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
//         >
//           <XAxis dataKey="date" />
//           <YAxis />
//           {/* <Tooltip labelClassName="tooltip" /> */}
//           {/* 
//           Uncomment the CartesianGrid if you want to add grid lines
//           */}
//           <CartesianGrid strokeDasharray="3 3" />
//           <CartesianGrid stroke="hsl(0, 0%, 80%)" strokeDasharray="2 5" />
//           <Line
//             type="linear"
//             dataKey="links"
//             stroke="#000"
//             dot={{ r: 5, fill: "#0066ff", stroke: "#fff", strokeWidth: 2 }}
//             strokeWidth={2}
//             activeDot={{ r: 10, stroke: "#fff", strokeWidth: 2 }}
//             isAnimationActive={true}
//             animationDuration={1000}
//             animationEasing="ease-in-out"
//             connectNulls={true}
//             legendType="line"
//             name="Links Created"
//           />
//           <Line
//             type="natural"
//             dataKey="links"
//             stroke="#0066ff"
//             activeDot={{ r: 10, stroke: "#fff", strokeWidth: 2 }}
//             dot={{ r: 5, fill: "#0066ff", stroke: "#fff", strokeWidth: 2 }}
//             strokeWidth={2}
//             isAnimationActive={true}
//             animationDuration={1000}
//             animationEasing="ease-in-out"
//             connectNulls={true}
//             legendType="line"
//             name="Links Created"
//           />
//           <XAxis dataKey="date" />
//           <YAxis allowDecimals={false} />
//           <Legend />
//           <Line
//             type="monotone"
//             dataKey="links"
//             stroke="#2563eb"
//             strokeWidth={2}
//             dot={{ r: 4 }}
//           />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default LineChartComponent;
