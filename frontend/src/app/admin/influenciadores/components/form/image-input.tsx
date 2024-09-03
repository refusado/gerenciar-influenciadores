import { FileUpload } from '@ark-ui/react';
import { Pencil, Trash, UploadSimple } from '@phosphor-icons/react/dist/ssr';
import { forwardRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import { registerInfluencerSchema } from './register-form';

export const ImageFileInput = forwardRef<HTMLInputElement>((props, ref) => {
  const [isSelected, setIsSelected] = useState(false);
  const { setValue } =
    useFormContext<z.infer<typeof registerInfluencerSchema>>();

  return (
    <FileUpload.Root
      ref={ref}
      {...props}
      accept="image/*"
      onFileChange={({ acceptedFiles }) => {
        if (!acceptedFiles.length) {
          setValue('image', '');
          setIsSelected(false);
        } else {
          setIsSelected(true);
        }
      }}
      className="group"
    >
      {!isSelected && (
        <FileUpload.Dropzone
          tabIndex={-1}
          className="flex min-h-20 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-zinc-200/50 bg-zinc-700/30 px-4 py-12 duration-300 hover:bg-zinc-700/40 group-data-[dragging]:bg-purple-600/5"
        >
          <UploadSimple className="size-10 opacity-50 duration-150 group-data-[dragging]:scale-110 group-data-[dragging]:opacity-70" />
          Solte um arquivo aqui
          <FileUpload.Trigger className="bg-amber-500/60 px-3 py-1 text-white hover:bg-amber-500/70 group-data-[dragging]:opacity-70">
            Escolher do meu dispositivo
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
      )}
      <FileUpload.ItemGroup>
        <FileUpload.Context>
          {({ acceptedFiles }) =>
            acceptedFiles.map((file) => (
              <FileUpload.Item key={file.name} file={file}>
                <FileUpload.ItemPreview
                  type="image/*"
                  className="group/image relative w-[clamp(180px,94vw,340px)] overflow-hidden rounded-md border-2 border-zinc-800"
                >
                  <div className="absolute top-2 mb-3 flex w-full gap-2 px-2 text-xs opacity-80 duration-500 *:rounded-full *:border-[1px] *:border-zinc-700/80 *:bg-zinc-950/90 *:px-2 *:py-1 group-hover/image:opacity-100">
                    <FileUpload.ItemName
                      title={file.name}
                      className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
                    />
                    <FileUpload.ItemSizeText />
                  </div>

                  <FileUpload.ItemPreviewImage className="aspect-square w-full object-cover" />

                  <div className="*:blue-500/50 absolute bottom-0 flex h-12 w-full text-zinc-300 opacity-70 backdrop-blur-sm duration-500 *:ring-inset group-hover/image:opacity-100">
                    <FileUpload.Trigger className="flex flex-1 items-center justify-center gap-2 bg-zinc-950/80 duration-200 hover:bg-zinc-950/95">
                      <Pencil className="size-5" /> Mudar
                    </FileUpload.Trigger>
                    <FileUpload.ItemDeleteTrigger className="flex flex-1 items-center justify-center gap-2 bg-zinc-950/80 duration-200 hover:bg-zinc-950/95">
                      <Trash className="size-5" /> Remover
                    </FileUpload.ItemDeleteTrigger>
                  </div>
                </FileUpload.ItemPreview>
              </FileUpload.Item>
            ))
          }
        </FileUpload.Context>
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
    </FileUpload.Root>
  );
});

ImageFileInput.displayName = 'ImageFileInput';
