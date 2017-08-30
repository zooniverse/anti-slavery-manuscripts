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
  console.log(type);
  console.log(format);
  console.log(src);
  return { type, format, src };
}

function getAllLocations(subject) {
  return subject.locations.map((image, i) => {
    const mimeType = Object.keys(image)
    return {
      src: image[mimeType],
      frame: i
    }
  });
}

export {
  getAllLocations,
  getSubjectLocation
};
