"use client"
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";

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

import { TUser } from "@/types";
import { createUserSchema } from "@/validation-schema/user";
import { branchList } from "@/hooks/api-hooks/branch-api-hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createUser } from "@/hooks/api-hooks/user-api-hooks";
import { Role } from "@prisma/client";
import { user } from "next-auth";
import useImagePick from "@/hooks/use-image-pick";

type Props = {
    state: boolean;
    onClose: (state: boolean) => void;
    editor : user;
    onCreate?: (newUser : TUser) => void;
};

type createTUser = z.infer<typeof createUserSchema>;

const CreateUserModal = ({ state, onClose, editor, onCreate }: Props) => {
    const { imageFile, imageURL, onSelectImage } = useImagePick({ maxWidthOrHeight : 300, maxOptimizedSizeMB : 0.5 });
    
    const form = useForm<createTUser>({
        resolver: zodResolver(createUserSchema),
        defaultValues: {
            email : "",
            name : "",
            password : "",
            role : "staff",
            branchId : -1
        },
    });

    const { data : branches, isLoading : branchLoading } = branchList();

    const reset = () => {
        form.reset();
        onClose(false);
    }

    const createUserMutation = createUser((newUser) => { reset() })

    const isLoading = createUserMutation.isPending || branchLoading;

    return (
        <Dialog open={state} onOpenChange={(state)=> reset() }>
            <DialogContent className="border-none shadow-2 sm:rounded-2xl font-inter">
                <ModalHead
                    title="Create User"
                    description="By creating a user, they will be able to use ACE System."
                />
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit((formValues) =>
                            createUserMutation.mutate(formValues)
                        )}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Name of user"
                                            className="placeholder:text-foreground/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="johndoe@gmail.com"
                                            className="placeholder:text-foreground/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="8 character password"
                                            className="placeholder:text-foreground/40"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role 🛡️</FormLabel>
                                    <Select disabled={branchLoading} onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {/* { editor.role === "root" && <SelectItem value={Role.root}>{Role.root}</SelectItem> } */}
                                            { editor.role === "root" && <SelectItem value={Role.admin}>{Role.admin}</SelectItem>}
                                            <SelectItem value={Role.staff}>{Role.staff}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                        control={form.control}
                        name="branchId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Branch</FormLabel>
                                <Select disabled={branchLoading} onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a branch" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {
                                            branches.map((branch)=> 
                                                <SelectItem key={branch.id} value={branch.id.toString()}>{branch.branchName}</SelectItem>
                                            )
                                        }
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                        <Separator className="bg-muted/70" />
                        <span className="text-sm text-destructive">{branches.length === 0 ? "theres no branches available" : ""}</span>
                        <div className="flex justify-end gap-x-2">
                            <Button
                                disabled={isLoading}
                                onClick={(e) => {
                                    e.preventDefault();
                                    reset();                                    
                                }}
                                variant={"ghost"}
                                className="bg-muted/60 hover:bg-muted"
                            >
                                Cancel
                            </Button>
                            <Button disabled={isLoading} type="submit">
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

export default CreateUserModal;
