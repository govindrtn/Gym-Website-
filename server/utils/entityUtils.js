function cleanDocument(document) {
  const data = document.toObject ? document.toObject() : { ...document };

  delete data._id;
  delete data.__v;

  return data;
}

function getInitials(name) {
  return String(name)
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export { cleanDocument, getInitials };
