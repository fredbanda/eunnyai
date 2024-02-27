'use client';

import React, { useState, useTransition } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from '../ui/form';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Input } from '../ui/input';
import { CustomField } from './CustomField';
import { AspectRatioKey, debounce, deepMergeObjects } from '@/lib/utils';
import { FileDiff } from 'lucide-react';
import { config } from 'process';
import { transformationTypes, defaultValues, aspectRatioOptions, creditFee } from '../../../constants';
import { updateCredits } from '@/lib/actions/user.actions';

export const formSchema = z.object({
  title: z.string(),
  aspectRatio: z.string().optional(),
  color: z.string().optional(),
  prompt: z.string().optional(),
  publicId: z.string(),
});

const TransformationForm = ({action, data = null, userId, type, creditBalance, config = null}: TransformationFormProps) => {
    const transformationType = transformationTypes[type];
    const [image, setImage] = useState(data);
    const [newTransformation, setNewTransformation] = useState<Transformations | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransforming, setIsTransforming] = useState(false);
    const [transformationConfig, setTransformationConfig] = useState(config)
    const [isPending, startTransition] = useTransition()

    const initialValues = data && action === 'Update' ? {
        title: data?.title,
        aspectRatio: data?.aspectRatio,
        color: data?.color,
        prompt: data?.prompt,
        publicId: data?.publicId,
    }  : defaultValues

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  const onSelectFieldHandler = (value: string, onChangeField: (value: string) => void) => {
    const imageSize = aspectRatioOptions[value as AspectRatioKey];

    setImage((prevState: any) => ({
      ...prevState,
      aspectRatio: imageSize.aspectRatio,
      width: imageSize.width,
      height: imageSize.height,

    }))

    setNewTransformation(transformationType.config)
    
    return onChangeField(value)
  }

  const onInputChangeHandler = (fieldName: string, value: string, type: string, onChangeField: (value: string) => void) => {
    debounce(() => {
      setNewTransformation((prevState: any) => ({
        ...prevState,
        [type]:{
          ...prevState?.[type],
        [fieldName === 'prompt' ? 'prompt' : 'to']: value
        }
      }))

      return onChangeField(value)
    }, 1000)
    
  }

  const onTransformHandler = () => {
    setIsTransforming(true)

    setTransformationConfig(
      deepMergeObjects(newTransformation, transformationType.config)
    )
    setNewTransformation(null)
    
    startTransition(async () => {
     {/*await updateCredits(userId,  creditFee) */}
    })
  }


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <CustomField 
            control={form.control}
            name="title"
            formLabel="Image Title"
            className="w-full"
            render={({ field}) => <Input {...field} className='input-field' />}
          />

          {type === 'fill' && (
              <CustomField 
              control={form.control}
              name="aspectRatio"
              formLabel="Aspect Ratio"
              className="w-full"
              render={({ field }) => (
                <Select 
                  onValueChange={(value) => onSelectFieldHandler(value, field.onChange)}
                  value={field.value}
                >
                <SelectTrigger className="select-field">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                    {Object.keys(aspectRatioOptions).map((key) => (
                    <SelectItem key={key} value={key}
                    className='select-item'
                    >
                      {aspectRatioOptions[key as AspectRatioKey].label}
                    </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              )}
              />
          )}

          {(type === 'remove' || type === 'recolor') && (
            <div className="prompt-field">
              <CustomField 
              control={form.control}
              name='prompt'
              formLabel={
                type === 'remove' ? 'Object to Remove' : 'Object to Recolor'
              }
              className='w-full'
              render={(({ field }) => (
                <Input {...field} 
                value={field.value}
                className='input-field'
                onChange={(e) => onInputChangeHandler(
                    'prompt',
                    e.target.value,
                    type,
                    field.onChange
                )}
                 />
              ))}
              />

              {type === 'recolor' && (
                <CustomField 
                control={form.control}
                name='color'
                formLabel='Replace Color'
                className='w-full'
                render={({field}) => (
                  <Input 
                  value={field.value}
                  className='input-field'
                  onChange={(e) => onInputChangeHandler(
                      'color',
                      e.target.value,
                      'recolor',
                      field.onChange
                  )}
                  />
                )}
                />
              )}
            </div>
          )}

          <div className='flex flex-col gap-4'>
          <Button
          type='submit'
          className='submit-button capitalize w-full'
          disabled={isTransforming || newTransformation === null } 
          onClick={onTransformHandler}
          >
            {isTransforming ? 'Transforming...' : 'Apply Transformation'}
          </Button>            
          <Button
          type='submit'
          className='submit-button capitalize w-full'
          disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Save Image'}
          </Button>            
          </div>

        </form>
      </Form>
    </>
  );
};

export default TransformationForm;