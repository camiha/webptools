const replaceExtension = (path: string, ext: string) => {
  const pathArr = path.split(".");
  pathArr.pop();
  return `${pathArr.join(".")}.${ext}`;
};

const isSupportExtension = (path: string): boolean => {
  const ext = path.split(".").slice(-1)[0];
  return ["png", "jpg", "jpeg"].includes(ext);
};

export { replaceExtension, isSupportExtension };
