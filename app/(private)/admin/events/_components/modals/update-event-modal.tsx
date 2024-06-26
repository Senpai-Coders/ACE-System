"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ModalHead from "@/components/modals/modal-head";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { updateEventSchema } from "@/validation-schema/event";
import { z } from "zod";
import { useCallback, useEffect } from "react";
import { TEventWithElectionWithCoopWithBranch } from "@/types";
import { onUploadImage } from "@/hooks/api-hooks/image-upload-api-hook";
import useImagePick from "@/hooks/use-image-pick";
import { v4  } from "uuid";
import { updateEvent } from "@/hooks/api-hooks/event-api-hooks";
import ImagePick from "@/components/image-pick";
import { user } from "next-auth";

type Props = {
   event: TEventWithElectionWithCoopWithBranch;
   state: boolean;
   onClose: (state: boolean) => void;
   user:user,
};

type TUpdateEventSchema = z.infer<typeof updateEventSchema>;

const UpdateEventModal = ({ event, state, onClose,user }: Props) => {


   const { imageURL, imageFile, onSelectImage, resetPicker } = useImagePick({
      initialImageURL: !event.coverImage
         ? "/images/default.png"
         : event.coverImage,
      maxOptimizedSizeMB: 1,
      maxWidthOrHeight: 800,
   });

   const eventForm = useForm<TUpdateEventSchema>({
      resolver: zodResolver(updateEventSchema),
   });

   const defaultValues = useCallback(() => {
      eventForm.setValue("title", event.title);
      eventForm.setValue("description", event.description);
      eventForm.setValue("location", event.location);
      eventForm.setValue("date", event.date);
      eventForm.setValue("coverImage", event.coverImage);
      eventForm.setValue("coopId", event.coop.id);
      eventForm.setValue("branchId", event.branch.id);
   }, [event, eventForm]);

   useEffect(() => {
      defaultValues();
   }, [event, eventForm]);

   const onCancelandReset = () => {
      eventForm.reset();
      onClose(false);
   };

   const updateEventMutation = updateEvent({ onCancelandReset, id: event.id });
   
   const uploadImage = onUploadImage();

   const isLoading = updateEventMutation.isPending;

   const isEventOnChange =
   eventForm.watch().title === event.title &&
   eventForm.watch().description === event.description &&
   eventForm.watch().location === event.location &&
   eventForm.watch().date === event.date &&
   eventForm.watch().coverImage === event.coverImage &&
   Number(eventForm.watch().branchId) === event.branch.id;

   console.log(eventForm.watch())

   const onSubmit = async (formValues: TUpdateEventSchema) => {
      console.log(formValues)
      try {
         if (!imageFile) {
            updateEventMutation.mutate({
               ...formValues,
               coverImage: eventForm.getValues("coverImage"),
            });
             resetPicker();
         } else {
            const image = await uploadImage.mutateAsync({
               fileName: `${v4()}`,
               folderGroup: "event",
               file: formValues.coverImage,
            });
            updateEventMutation.mutate({
               ...formValues,
               coverImage: !image ? "/images/default.png" : image,
            });
            console.log(image)
            resetPicker();
         }
      } catch (error) {
         console.log(error);
      }
   };

   return (
      <Dialog
         open={state}
         onOpenChange={(state) => {
            onClose(state);
         }}
      >
         <DialogContent className="border-none shadow-2 sm:rounded-2xl max-w-[600px] font-inter">
            <ModalHead
               title="Edit Event"
               description="Edit Event: You will be able to edit the basic information of this event, but not its category."
            />
            <Form {...eventForm}>
               <form
                  onSubmit={eventForm.handleSubmit(onSubmit)}
                  className=" space-y-3"
               >
                  <FormField
                     control={eventForm.control}
                     name="title"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Event Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="event name"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={eventForm.control}
                     name="description"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Event Description</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="short description of the event"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={eventForm.control}
                     name="location"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Event Address</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="address of the Event"
                                 className="placeholder:text-foreground/40"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={eventForm.control}
                     name="date"
                     render={({ field }) => (
                        <FormItem className="flex flex-col">
                           <FormLabel>Date of Event</FormLabel>
                           <Popover>
                              <PopoverTrigger asChild>
                                 <FormControl>
                                    <Button
                                       variant={"outline"}
                                       className={cn(
                                          "w-[240px] pl-3 text-left font-normal",
                                          !field.value &&
                                             "text-muted-foreground"
                                       )}
                                    >
                                       {field.value ? (
                                          format(field.value, "PPP")
                                       ) : (
                                          <span>Pick a date</span>
                                       )}
                                       <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                 </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                 className="w-auto p-0"
                                 align="start"
                              >
                                 <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                       date <
                                       new Date(
                                          new Date().setDate(
                                             new Date().getDate() - 1
                                          )
                                       )
                                    }
                                    captionLayout="dropdown-buttons"
                                    fromYear={1900}
                                    toYear={new Date().getFullYear()}
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={eventForm.control}
                     name="coverImage"
                     render={({ field }) => {
                        return (
                           <FormItem>
                              <FormLabel>Profile</FormLabel>
                              <FormControl>
                                 <ImagePick
                                    className="flex flex-col items-center gap-y-4"
                                    url={imageURL}
                                    onChange={async (e) => {
                                       field.onChange(await onSelectImage(e));
                                    }}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        );
                     }}
                  />
                  
                  <Separator className="bg-muted/70" />
                  <div className="flex justify-end gap-x-2">
                     <Button
                        disabled={isLoading}
                        onClick={(e) => {
                           e.preventDefault();
                           onClose(false)
                        }}
                        variant={"secondary"}
                        className="bg-muted/60 hover:bg-muted"
                     >
                        cancel
                     </Button>
                     <Button disabled={isEventOnChange} type="submit">
                        {isLoading ? (
                           <Loader2
                              className="h-3 w-3 animate-spin"
                              strokeWidth={1}
                           />
                        ) : (
                           "Save"
                        )}
                     </Button>
                  </div>
               </form>
            </Form>
         </DialogContent>
      </Dialog>
   );
};

export default UpdateEventModal;
