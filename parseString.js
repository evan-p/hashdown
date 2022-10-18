const sectionType = [
  {
    title: '',
    content: '',
    path: '',
    tags: [{
      txt: '',
    }],
  }
]

/**
 * @param {string} contentStr
 * @param {string} path
 */
const parseString = (contentStr, path) => {
  const content = contentStr.split('');
  /**
   * @type {sectionType}
   */
  const sections = [];
  let currentSection;
  let currentTag;
  
  const newSection = () => {
    currentSection = {
      title: '',
      content: '',
      path,
      tags: [],
    };
    sections.push(currentSection);
  }
  
  const newTag = () => {
    currentTag = { txt: '' };
    currentSection.tags.push(currentTag);
  }
  const ch = (p) => content[p || i] || '';
  
  let i;
  
  newSection();
  
  const isSpace = () => /\s/.test(ch());
  const isLetter = () => /[a-z_A-Z]/.test(ch());
  const isTitle = () => {
    if (content.slice(i, i+2).join('') == '# ') {
      return true;
    }
    if (content.slice(i, i+3).join('') == '## ') {
      return true;
    }
    if (content.slice(i, i+4).join('') == '### ') {
      return true;
    }
    if (content.slice(i, i+5).join('') == '#### ') {
      return true;
    }
    if (content.slice(i, i+6).join('') == '##### ') {
      return true;
    }
    if (content.slice(i, i+3).join('') == '###### ') {
      return true;
    }
    return false;
  }
  const isNewLine = () => ch() == '\n';
  
  const isTag = () => /#[a-z_A-Z]/.test(ch() + ch(i+1));
  
  const parseTitle = () => {
    new_line_space = '';
    newSection();
    for (i = i; i < content.length; i++) {
      if (isNewLine()) {
        break;
      } else {
        currentSection.title += ch();
      }
    }
  }
  
  const parseTag = () => {
    newTag();
    for (i = i+1; i < content.length; i++) {
      if (isLetter()) {
        currentTag.txt += ch();
        currentSection.content += ch();
      } else {
        break;
      }
    }
  }

  const parseContent = () => {
    currentSection.content += new_line_space;
    new_line_space = '';
    for (i = i; i < content.length; i++) {
      if (isTag()) {
        parseTag();
      }
      currentSection.content += ch();
      if (isNewLine()) {
        break;
      }
    }
  }
  
  let new_line_space = '';
  
  for (i = 0; i < content.length; i++) {
    // parsing new line
    if (isSpace()) {
      new_line_space += ch();
    } else if (isTitle()) {
      parseTitle();
    } else {
      parseContent();
    }
  }
  return sections;
}

module.exports = parseString;