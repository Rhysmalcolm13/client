import React, { useEffect, useState } from "react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

interface UserAvatarProps {
    url?: string;
    size: number;
    onUpload: (filePath: string) => void;
}

export default function UserAvatar({ url, size, onUpload }: UserAvatarProps) {
    const supabase = useSupabaseClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (url) {
            downloadImage(url);
        }
    }, [url]);

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from("avatars").download(path);
            if (error) {
                throw error;
            }
            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error: any) {
            console.log("Error downloading your avatar: ", error.message);
        }
    }

    async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload");
            }
            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;
            const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file);
            if (uploadError) {
                throw uploadError;
            }
            onUpload(filePath);
        } catch (error: any) {
            alert(error.message);
        } finally {
            setUploading(false);
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="Avatar for user"
                    className="avatar image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}

            <div style={{ width: size }}>
                <label className="btn bg-[#85DDA2] text-white my-2">
                    {uploading ? "Uploading..." : "Upload new avatar"}
                    <input
                        style={{ display: 'none' }}
                        type="file"
                        accept="image/*"
                        onChange={uploadAvatar}
                        disabled={uploading}
                    />
                </label>
            </div>
        </div>
    );
};

interface UserAvatarPropsNullUpload {
    url: string | null;
    size: number;
}

export function UserAvatarNullUpload({ url, size }: UserAvatarProps) {
    const supabase = useSupabaseClient();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        if (url) {
            downloadImage(url);
        }
    }, [url]);

    async function downloadImage(path: string) {
        try {
            const { data, error } = await supabase.storage.from("avatars").download(path);
            if (error) {
                throw error;
            }

            const url = URL.createObjectURL(data);
            setAvatarUrl(url);
        } catch (error: any) {
            console.log("Error downloading avatar: ", error.message);
        }
    }

    return (
        <div>
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="avatar image"
                    style={{ height: size, width: size }}
                />
            ) : (
                <div className="avatar no-image" style={{ height: size, width: size }} />
            )}
        </div>
    );
}