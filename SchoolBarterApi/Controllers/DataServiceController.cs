using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.OData;
using ScholarBarterApi.Model;

namespace ScholarBarterApi.Controllers
{
    public class DataServiceController : ApiController
    {
      private readonly DataClassesDataContext _dc;
      //TODO  Add Dominick other API's 
      public DataServiceController()
      {
        _dc = new DataClassesDataContext(ConfigurationManager.ConnectionStrings["ApiConnectionString"].ConnectionString);
      }

      [HttpGet]
      [EnableQuery]
      public HttpResponseMessage Listings()
      {
        var listings = _dc.Listings.Where(listing => listing.Active).ToList();
        HttpContext.Current.Response.Headers.Add("X-InlineCount", listings.Count.ToString(CultureInfo.InvariantCulture));
        return Request.CreateResponse(HttpStatusCode.OK, listings.AsQueryable());
      }

      [HttpGet]
      [EnableQuery]
      public HttpResponseMessage ListingTypes()
      {
        var listingTypes = _dc.ListingTypes.ToList();
        HttpContext.Current.Response.Headers.Add("X-InlineCount", listingTypes.Count.ToString(CultureInfo.InvariantCulture));
        return Request.CreateResponse(HttpStatusCode.OK, listingTypes.AsQueryable());
      }


      [HttpGet]
      [EnableQuery]
      public HttpResponseMessage Users()
      {
        var customers = _dc.Users.ToList();
        HttpContext.Current.Response.Headers.Add("X-InlineCount", customers.Count().ToString(CultureInfo.InvariantCulture));
        return Request.CreateResponse(HttpStatusCode.OK, customers);
      }

      [HttpGet]
      [EnableQuery]
      public HttpResponseMessage CustomersSummary()
      {
        var customers = _dc.Users.ToList();
        HttpContext.Current.Response.Headers.Add("X-InlineCount", customers.Count().ToString(CultureInfo.InvariantCulture));
        return Request.CreateResponse(HttpStatusCode.OK, customers);
      }

      [HttpGet]
      public HttpResponseMessage CheckUnique(int id, string property, string value)
      {
        return Request.CreateResponse(HttpStatusCode.OK, new OperationStatus { Status = true });
      }

      
      [HttpPost]
      public HttpResponseMessage Login([FromBody]UserLogin userLogin)
      {
        var validUser =
          _dc.Users.FirstOrDefault(user => user.EduEmail == userLogin.UserName && user.PasswordHash == userLogin.Password);
        return Request.CreateResponse(HttpStatusCode.OK, validUser);
      }

      [HttpPost]
      public HttpResponseMessage Logout()
      {
        //Simulated logout
        return Request.CreateResponse(HttpStatusCode.OK, new { status = true });
      }

      // GET api/<controller>/5
      [HttpGet]
      public HttpResponseMessage CustomerById(int id)
      {
        var customer = _dc.Users.FirstOrDefault(user => user.UserId == id);
        return Request.CreateResponse(HttpStatusCode.OK, customer);
      }

      // POST api/<controller>
      [HttpPost]
      //public HttpResponseMessage AddListing(int userId, string title, string desc, string type, int quantity, int price)
      public HttpResponseMessage AddListing([FromBody]Listing newListing)
      {
        try
        {
          newListing.Active = true;
          newListing.CreationTime = DateTime.Now;
          _dc.Listings.InsertOnSubmit(newListing);
          _dc.SubmitChanges();
          return Request.CreateResponse(HttpStatusCode.Created, newListing);
        }
        catch (Exception ex)
        {
          return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, ex.Message);
        }
      }

      // POST api/<controller>
      public HttpResponseMessage PostCustomer([FromBody]User customer)
      {
        //var opStatus = _Repository.InsertCustomer(customer);
        //if (opStatus.Status)
        if (true)
        {
          var response = Request.CreateResponse<User>(HttpStatusCode.Created, customer);
          string uri = Url.Link("DefaultApi", new { id = customer.UserId });
          response.Headers.Location = new Uri(uri);
          return response;
        }
        return Request.CreateErrorResponse(HttpStatusCode.NotFound, "Error - Contact your admin");
      }

      // PUT api/<controller>/5
      public HttpResponseMessage PutCustomer(int id, [FromBody]User customer)
      {
        //var opStatus = _Repository.UpdateCustomer(customer);
        //if (opStatus.Status)
        if (true)
        {
          return Request.CreateResponse<User>(HttpStatusCode.Accepted, customer);
        }
        //return Request.CreateErrorResponse(HttpStatusCode.NotModified, opStatus.ExceptionMessage);
      }

      // DELETE api/<controller>/5
      public HttpResponseMessage DeleteCustomer(int id)
      {
        //var opStatus = _Repository.DeleteCustomer(id);

        //if (opStatus.Status)
        if (true)
        {
          return Request.CreateResponse(HttpStatusCode.OK);
        }
        else
        {
          //return Request.CreateErrorResponse(HttpStatusCode.NotFound, opStatus.ExceptionMessage);
        }
      }
    }
}
