export const getMicrophone = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true});
    return stream;
};