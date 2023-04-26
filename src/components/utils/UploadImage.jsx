import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from 'react-toastify'

// UploadImage function component
export function UploadImage(file, setLoading) {

    return new Promise((resolve, reject) => {

        const storage = getStorage()

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        if (!file) {
            toast.error("Empty image!")
            setLoading(false)
            reject()
        }

        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'images/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        setLoading(false)
                        toast.error("Something wrong")
                        reject()
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        setLoading(false)
                        toast.error("Something wrong")
                        reject()
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        setLoading(false)
                        toast.error("Something wrong")
                        reject()
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        setLoading(false)
                        toast.error("Something wrong")
                        reject()
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    resolve(downloadURL)
                });
            }
        );
    })


}

