const SurveyCreation = () => {
  return (
    <div className="grid grid-cols-3 w-full h-screen">
      <div className="col-span-1 bg-red-500 flex items-center justify-center">
        <h1>Survey Creation</h1>
      </div>
      <div className="col-span-2 bg-blue-500 flex items-center justify-center">
        <h1>Survey Preview</h1>
      </div>
    </div>
  );
};

export default SurveyCreation;