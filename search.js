// const isBrowser = typeof window !== 'undefined';

// const request = isBrowser
//   ? require('./request')
//   : require('request').defaults({ jar: true });
// const he = require('he');
// const after = require('after');

// module.exports = suggest;

const urlBase = 'https://clients1.google.com/complete/search';
const resRegex = /^window\.google\.ac\.h\((.*)\)$/;
const userAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.104 Safari/537.36';
let reqId = 0;

function suggest(keyword, opts, cb) {
  if (typeof cb === 'undefined' && typeof opts === 'function') {
    cb = opts;
    opts = {};
  }

  if (typeof opts.client === 'undefined') {
    opts.client = 'heirloom-hp';
  }

  if (typeof opts.hl === 'undefined') {
    opts.hl = 'en';
  }

  if (typeof opts.cp === 'undefined') {
    opts.cp = keyword.length;
  }

  opts.levels = opts.levels || 0;
  if (opts.levels === 0) {
    doSuggest(keyword, opts, cb);
  } else if (opts.levels === 1) {
    const nA = 'a'.charCodeAt(0);
    const next = after(26, done);
    let results = [];

    for (let i = 0; i < 26; i++) {
      c = String.fromCharCode(nA + i);
      doSuggest(`${keyword} ${c}`, opts, function (err, suggestions) {
        if (err) {
          return next(err);
        }
        results = results.concat(suggestions);
        next();
      });
    }
    function done() {
      cb(null, results);
    }
  } else {
    doSuggest(keyword, opts, cb);
  }
}

function doSuggest(keyword, opts, cb) {
  const qs = {
    client: opts.client,
    hl: opts.hl,
    gs_rn: 0,
    gs_ri: opts.client,
    cp: opts.cp,
    gs_id: reqId++,
    q: keyword,
  };

  if (opts.client === 'youtube') {
    qs.ds = 'yt';
  }
  request(
    {
      url: urlBase,
      qs,
      headers: { 'User-Agent': userAgent },
    },
    function (err, res, body) {
      if (err) {
        return cb(err);
      }
      if (typeof body === 'string') {
        const m = resRegex.exec(body);
        try {
          body = m ? JSON.parse(m[1]) : [];
        } catch (err) {
          return cb(err);
        }
      }

      if (Array.isArray(body) && body.length) {
        const suggestions = body[1].map(function (item) {
          return he.decode(stripTags(item[0]));
        });
        return cb(null, suggestions);
      }

      cb(null, []);
    }
  );
}

const stripTagsRegex = /\<\/?[^\>]+\>/g;
function stripTags(s) {
  return s.replace(stripTagsRegex, '');
}
