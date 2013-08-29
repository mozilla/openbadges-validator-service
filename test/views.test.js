var cheerio = require('cheerio');
var should = require('should');
var nunjucks = require('nunjucks');
var filters = require('../').filters;

var loader = new nunjucks.FileSystemLoader(__dirname + '/../views');
var env = new nunjucks.Environment(loader, { autoescape: true });

Object.keys(filters).forEach(function(name) {
  env.addFilter(name, filters[name]);
});

function render(view, ctx) {
  return cheerio.load(env.render(view, ctx));
}

describe('views/', function() {
  describe('index.html', function() {
    it('should show pretty-printed assertion, if available', function() {
      var $ = render('index.html', {
        assertion: { hi: 'there' },
        assertionString: JSON.stringify({ hi: 'there' })
      });
      var expected = filters.pprint({ hi: 'there' });
      $('textarea[name=assertion]').text().should.equal(expected);
    });

    it('should show assertion string if not', function() {
      var $ = render('index.html', {
        assertionString: JSON.stringify({ hi: 'there' })
      });
      $('textarea[name="assertion"]').text().should.equal(JSON.stringify({ hi: 'there' }));
    });

    it('should show status', function() {
      var $ = render('index.html', {
        response: {
          status: 'foo'
        }
      });
      $('.status').text().should.equal('Foo');
    });

    it('should not render scripts when NO_JS is set', function() {
      var $ = render('index.html', {
        NO_JS: true
      });
      $('script').length.should.equal(0);
    });

    it('should add ?no_js=1 to action when set', function() {
      var $ = render('index.html', {
        NO_JS: true
      });
      $('form').attr('action').should.include('?no_js=1');
    });
  });

  describe('response.html', function() {
    it('should show spec version if valid', function() {
      var $ = render('response.html', {
        response: {
          status: 'valid',
          info: {
            version: 'XXX'
          }
        }, 
        valid: true
      });
      $('.version').should.have.length(1);
      $('.version').text().should.match(/XXX/);
    });
  
    it('should show error reason if invalid', function() {
      var $ = render('response.html', {
        response: {
          status: 'invalid',
          reason: 'asplosions'
        }, 
        valid: false
      });
      $('.reason').should.have.length(1);
      $('.reason').text().should.match(/asplosions/);
    });

    it('should dump pretty-printed response object onto page', function() {
      var $ = render('response.html', {
        response: { status: 'whatever' }
      });
      $('.response').text().should.equal(filters.pprint({ status: 'whatever' }));
    });
  });
});
