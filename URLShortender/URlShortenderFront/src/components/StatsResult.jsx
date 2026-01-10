import KeyValueCard from "./UI/KeyValueCard";

const StatsResult = ({ data }) => {
  if (!data) return null;

  return (
    <KeyValueCard
      title="Statistics"
      items={[
        { label: "Original URL", value: data.originalUrl, copy: true },
        { label: "Clicks", value: data.clicks },
        { label: "Created", value: new Date(data.createdAt).toLocaleString() },
      ]}
    />
  );
};

export default StatsResult;