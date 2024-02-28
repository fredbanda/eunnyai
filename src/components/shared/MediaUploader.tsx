import React from 'react'
import { useToast } from '../ui/use-toast';
import { CldImage, CldUploadWidget } from 'next-cloudinary'
import Image from 'next/image'
import { dataUrl, getImageSize } from '@/lib/utils';
import { PlaceholderValue } from 'next/dist/shared/lib/get-img-props';


type MediaUploaderProps = {
  onValueChange: (value: string) => void
  setImage: React.Dispatch<any>
  image: any
  publicId: string
  type: string
}
const MediaUploader = ({onValueChange, setImage, image, publicId, type}: MediaUploaderProps) => {
    const {toast} = useToast();

    const onUploadSuccessHandler = (result: any) => {
      toast({
        title: 'Media uploaded successfully',
        description: '1 credit was deducted from your account',
        className: 'success-toast',
        duration: 5000,
      })
    }

    const onUploadErrorHandler = (error: any) => {
      toast({
        title: 'Something went wrong while uploading.',
        description: 'Please try again',
        variant: 'destructive',
        className: 'error-toast',
        duration: 5000,
      })
    }
  return (
    <CldUploadWidget
    uploadPreset='tfpg_eunnyai'
    options={{
      multiple: false,
      resourceType: 'image',
    }}
    onSuccess={onUploadSuccessHandler}
    onError={onUploadErrorHandler}
    >
      {({ open}) => (
        <div className="flex flex-col gap-4">
            <h3 className='h3-bold text-dark-600'> Original</h3>

            {publicId ? (
              <>
              <div className='cursor-pointer overflow-hidden rounded-[10px]'>
                <CldImage 
                width={getImageSize(type, image, 'width')}
                height={getImageSize(type, image, 'height')}
                src={publicId}
                alt="image"
                sizes={"(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
                placeholder={dataUrl as PlaceholderValue}
                className='mdia-uploader_cldImage'
                />
              </div>
              </>
            ): (
              <div className='media-uploader_cta' onClick={() => open()}>
                <div className='media-uploader_cta-image'>
                  <Image 
                  src='/assets/icons/add.svg'
                  alt='add'
                  width={24}
                  height={24}
                  />                
                  </div>
                  <p className="p-14-medium">
                    Click Here To Upload An Image
                  </p>
              </div>
            )}
        </div>
      )}
    </CldUploadWidget>
  )
}

export default MediaUploader
