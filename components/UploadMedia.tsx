"use client";

interface Props {
    files: File[];
    setFiles: React.Dispatch<
        React.SetStateAction<File[]>
    >;
}

export default function UploadMedia({
    files,
    setFiles,
}: Props) {
    
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        if (!e.target.files) return

        setFiles(
            Array.from(e.target.files)
        );
    };

    return(
        <div>
            <input type="file" multiple accept="image/*" onChange={handleChange}></input>

            <div className="mt-5">

                {files.map((file) => (
                    <p key={file.name}>{file.name}</p>
                ))}
            </div>
        </div>
    );
}


