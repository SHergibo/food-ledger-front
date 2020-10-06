let slugify = require('slugify');
slugify.extend({
  ':': '-', 
  '.': '_', 
  '@': 'at'
});
export default function slugUrl(string) {
  return slugify(string, {
    lower: true,
    remove: /[*+~()'"\\\\!/]/g
  })
}