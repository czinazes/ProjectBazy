import KeyValueCard from "./UI/KeyValueCard";

const ShortenResult = ({ data }) => {
  if (!data) return null;

  return (
    <KeyValueCard
      title="Short link created"
      items={[
        { label: "Short URL", value: data.shortUrl, copy: true },
        { label: "Code", value: data.shortCode, copy: true },
        ...(data.expiresAt ? [{ label: "Expires", value: new Date(data.expiresAt).toLocaleString() }] : []),
      ]}
    />
  );
};

export default ShortenResult;
