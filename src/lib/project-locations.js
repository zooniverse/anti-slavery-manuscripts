let ProjectLinks = {};

if (process.env.NODE_ENV === 'production') {
  ProjectLinks.host = 'https://www.zooniverse.org/'
  ProjectLinks.id = '4973';
  ProjectLinks.slug = 'bostonpubliclibrary/anti-slavery-manuscripts';
} else {
  ProjectLinks.host = 'https://master.pfe-preview.zooniverse.org/'
  ProjectLinks.id = '1764';
  ProjectLinks.slug = 'wgranger-test/anti-slavery-testing';
}

export default ProjectLinks;
