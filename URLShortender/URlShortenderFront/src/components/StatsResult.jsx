import KeyValueCard from "./UI/KeyValueCard";

const StatsResult = ({ data }) => {
  if (!data) return null;

  const items = [
    { label: "Original URL", value: data.originalUrl, copy: true },
    { label: "Clicks", value: data.clicks },
  ];

  if (data.createdAt) {
    items.push({ label: "Created", value: new Date(data.createdAt).toLocaleString() });
  }

  return (
    <KeyValueCard
      title="Statistics"
      items={items}
    />
  );
};

export default StatsResult;
