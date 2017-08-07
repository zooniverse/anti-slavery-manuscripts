const READABLE_FORMATS = {
  image: ['jpeg', 'png', 'svg+xml', 'gif'],
};

function getSubjectLocation(subject, frame = 0) {
  let format;
  let type;
  let src;

  const currentLocation = subject.locations[frame];

  Object.keys(currentLocation).some((mimeType) => {
    src = currentLocation[mimeType];
    [type, format] = mimeType.split('/');
    const extensions = type || [];
    if (type in READABLE_FORMATS && READABLE_FORMATS[extensions].includes(format)) {
      return type;
    }
  });

  return { type, format, src };
}

function getAllLocations(subject) {
  return subject.locations.map((image) => {
    const mimeType = Object.keys(image)
    return image[mimeType];
  });
}

export {
  getAllLocations,
  getSubjectLocation
};
