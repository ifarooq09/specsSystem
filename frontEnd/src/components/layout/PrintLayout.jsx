/* eslint-disable react/prop-types */
const PrintLayout = ({ specDetails }) => {
  if (!specDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Specification Details</h1>
      <p><strong>Unique Number:</strong> {specDetails.uniqueNumber}</p>
      <p><strong>Directorate:</strong> {specDetails.directorate.name}</p>
      <p><strong>Created By:</strong> {`${specDetails.createdBy.firstName} ${specDetails.createdBy.lastName}`}</p>
      <p><strong>Created At:</strong> {new Date(specDetails.createdAt).toLocaleString()}</p>
      <p><strong>Updated By:</strong> {`${specDetails.updatedBy.firstName} ${specDetails.updatedBy.lastName}`}</p>
      <p><strong>Updated At:</strong> {new Date(specDetails.updatedAt).toLocaleString()}</p>
      <h2>Specifications</h2>
      {specDetails.specifications.map((spec, index) => (
        <div key={index}>
          <p><strong>Category:</strong> {spec.category.categoryName}</p>
          <p><strong>Description:</strong> {spec.description.split('-').join('\n-')}</p>
        </div>
      ))}
    </div>
  );
};

export default PrintLayout;
