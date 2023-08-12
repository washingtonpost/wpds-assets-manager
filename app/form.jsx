import React from "react";
import * as Kit from "@washingtonpost/wpds-ui-kit";

export const Form = () => {
  const [files, setFiles] = React.useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  return (
    <form action="/api/upload" method="POST" encType="multipart/form-data">
      <Kit.Fieldset>
        <Kit.InputLabel htmlFor="assets">Drag to Upload Assets</Kit.InputLabel>
        <Kit.InputText
          css={{
            size: 300,
          }}
          type="file"
          name="assets"
          id="assets"
          multiple
          label="Drag to Upload Assets"
          onChange={handleFileChange}
        />
      </Kit.Fieldset>

      <Kit.Fieldset>
        <Kit.Button type="submit">Upload</Kit.Button>
      </Kit.Fieldset>

      <h2>Ready to Upload Assets</h2>
      <ul>
        {files.map((file) => (
          <li key={file.name}>
            {file.name}
            <img
              width={100}
              height={100}
              src={URL.createObjectURL(file)}
              alt={file.name}
            />
          </li>
        ))}
      </ul>
    </form>
  );
};