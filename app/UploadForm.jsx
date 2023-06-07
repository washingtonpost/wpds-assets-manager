import { Button, InputText } from "@washingtonpost/wpds-ui-kit";
import React from "react";

const UploadForm = () => {
  return (
    <section>
      <h1>Upload Assets Form</h1>
      <form action="/api/upload" method="POST" encType="multipart/form-data">
        <div>
          <InputText
            label="Choose asset(s)"
            type="file"
            name="file"
            id="file"
            multiple={true}
          />
        </div>
        <Button type="submit">Upload</Button>
      </form>
    </section>
  );
};

export default UploadForm;
