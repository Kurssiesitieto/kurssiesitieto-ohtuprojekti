const parseIamGroups = (iamGroups) =>
  iamGroups?.split(';').filter(Boolean) ?? [];

const checkAdmin = (iamGroups) => iamGroups.includes('grp-toska');

const mockHeaders = {
    uid: 'testUser',
    mail: 'address@helsinki.fi',
    preferredlanguage: 'fi',
    hypersonsisuid: 'hy-hlo-123456789',
    hygroupcn: 'grp-toska;hy-employees',
};

const validateHelsinkiEmail = (email) => {
    // Define the regular expression pattern to match emails ending with @helsinki.fi
    const helsinkiEmailPattern = /^[a-zA-Z0-9._%+-]+@helsinki\.fi$/;
  
    return helsinkiEmailPattern.test(email);
};

const getHeaders = (req) => process.env.NODE_ENV === 'production' ? req.headers : mockHeaders;

const areHeadersValid = (headers) => {
    // if (!headers.uid || !validateHelsinkiEmail(headers.mail)) {
    if (!headers.uid) {
      return false;
    }
    return true;
};

const createUser = (headers) => {
    const {
      uid: username = 'testuser',
      mail: email = '',
      preferredlanguage: language = '',
      hypersonsisuid: id = '',
      hygroupcn = '',
    } = headers;
  
    const iamGroups = parseIamGroups(hygroupcn);
  
    return {
      id,
      username,
      email,
      language,
      iamGroups,
      isAdmin: checkAdmin(iamGroups),
    };
};

const userMiddleware = (req, res, next) => {
  console.log(req.headers)
  const headers = getHeaders(req);

//    if (!areHeadersValid(headers)) {
//      req.kirjauduttu = false;
//      req.user = 'käyttäjää ei tunnistettu';
//      return next();
//    }
  
    req.kirjauduttu = true;
    req.user = createUser(headers);
  
    return next();
  };

module.exports = {
    validateHelsinkiEmail,
    parseIamGroups,
    checkAdmin,
    areHeadersValid,
    createUser,
    userMiddleware,
    mockHeaders,
  };