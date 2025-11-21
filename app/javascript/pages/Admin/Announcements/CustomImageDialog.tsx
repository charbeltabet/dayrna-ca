import { useCellValues, usePublisher, imageDialogState$, saveImage$, closeImageDialog$ } from '@mdxeditor/editor';
import { useForm } from 'react-hook-form';
import ImageSelector from '../Homepage/HomeForm/ImageSelector';

interface SaveImageParameters {
  src?: string;
  altText?: string;
  title?: string;
}

export default function CustomImageDialog() {
  const [state] = useCellValues(imageDialogState$);
  const saveImage = usePublisher(saveImage$);
  const closeImageDialog = usePublisher(closeImageDialog$);

  const { register, handleSubmit, setValue, watch } = useForm<SaveImageParameters>({
    values: state.type === 'editing' ? state.initialValues : {}
  });

  const selectedImage = watch('src');

  if (state.type === 'inactive') {
    return null;
  }

  const onSubmit = (data: SaveImageParameters) => {
    saveImage(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {state.type === 'editing' ? 'Edit Image' : 'Insert Image'}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Image Selector */}
              <ImageSelector
                value={selectedImage ? { thumbnail_url: selectedImage, label: selectedImage } : null}
                onChange={(option: any) => {
                  if (option && option.thumbnail_url) {
                    setValue('src', option.thumbnail_url);
                  }
                }}
              />

              {/* Preview */}
              {selectedImage && (
                <div className="mt-4">
                  <label className="block mb-2 font-bold text-sm">Preview:</label>
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="max-w-full h-auto max-h-64 border rounded"
                  />
                </div>
              )}

              {/* Alt Text */}
              <div>
                <label htmlFor="altText" className="block mb-2 font-bold text-sm">
                  Alt Text (required for accessibility)
                </label>
                <input
                  id="altText"
                  {...register('altText')}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe the image"
                />
              </div>

              {/* Title */}
              <div>
                <label htmlFor="title" className="block mb-2 font-bold text-sm">
                  Title (optional)
                </label>
                <input
                  id="title"
                  {...register('title')}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Image title"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => closeImageDialog()}
                className="px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedImage}
              >
                {state.type === 'editing' ? 'Update' : 'Insert'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
