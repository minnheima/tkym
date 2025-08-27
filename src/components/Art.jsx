function Art({ data }) {
  return (
    <>
      <div className="art-content">
        {data.iframe && (
          <div
            className="iframe-wrapper"
            dangerouslySetInnerHTML={{ __html: data.iframe }}
          />
        )}
        {data.src.map((item, index) => (
          <img
            src={item}
            key={`${data.name}-${index}`}
            alt={`${data.title}-${index}`}
          />
        ))}
      </div>
    </>
  );
}
export default Art;
