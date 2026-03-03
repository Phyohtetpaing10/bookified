import UploadFrom from "@/components/UploadForm";

const Page = () => {
  return (
    <main className="wrapper container">
      <div className="mx-auto max-w-180 space-y-10">
        <section className="flex flex-col gap-5">
          <h1 className="page-title-xl">Add New Book</h1>
          <p className="page-description-lg">
            Upload a PDF to generate your interactive AI book companion.
          </p>
        </section>
        <UploadFrom />
      </div>
    </main>
  );
};

export default Page;
