using System.Configuration;
using ScholarBarter.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data.Linq;
using System.Data.Linq.Mapping;

namespace ScholarBarter.Repository
{
    internal static class DataInitializer
    {
        internal static void Initialize(UserManagerContext context)
        {
            var random = new Random((int)DateTime.Now.Ticks);
            var randomOrder = new Random((int)DateTime.Now.Ticks);
            var randomQuantity = new Random((int)DateTime.Now.Ticks);

            // Use a connection string.
            var db = new DataClassesDataContext(ConfigurationManager.ConnectionStrings["ApiConnectionString"].ConnectionString);

            var sortedStates = states.OrderBy(s => s.Name);
            foreach (var state in sortedStates)
            {
                context.States.Add(state);
            }

          var usersList = db.tblUsers.ToList();
            //Generate customers and orders
          for (int i = 0; i < usersList.Count(); i++)
            {
              var user = usersList[i];
                var cityState = SplitValue(citiesStates[i]);
                var cust = new User 
                {
                    Id = i + 1,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email= String.Format("{0}.{1}@{2}", user.FirstName, user.LastName, user.Email),
                    Address = addresses[i],
                    City = cityState[0],
                    State = sortedStates.Where(state => state.Abbreviation == cityState[1]).SingleOrDefault(),
                    Zip = zip + i,
                    Gender = (Gender)Enum.Parse(typeof(Gender), user.Gender)
                };
                context.Customers.Add(cust);

                //Generate customer orders
                var numToGrab = random.Next(orders.Count - 1);
                var custOrders = new List<Order>();
                for (int j = 0; j < numToGrab; j++)
                {
                    var orderPosition = randomOrder.Next(orders.Count - 1);
                    custOrders.Add(orders[orderPosition]);
                }

                foreach (var order in custOrders)
                {
                    var quantity = randomQuantity.Next(5);
                    var multiplier = (quantity % 2 == 0) ? 1 : -1;
                    var custOrder = order.Clone();
                    custOrder.Quantity = (quantity == 0) ? 1 : quantity;
                    custOrder.Date = DateTime.Now.AddDays(randomQuantity.Next(30) * multiplier);
                    custOrder.CustomerId = cust.Id;
                    context.Orders.Add(custOrder);
                }
            }
             
        }

        private static string[] SplitValue(string val)
        {
            return val.Split(',');
        }

        static string[] addresses = 
        { 
            "1234 Anywhere St.", 
            "435 Main St.", 
            "1 Atomic St.", 
            "85 Cedar Dr.", 
            "12 Ocean View St.", 
            "1600 Amphitheatre Parkway", 
            "1604 Amphitheatre Parkway", 
            "1607 Amphitheatre Parkway", 
            "346 Cedar Ave.", 
            "4576 Main St.", 
            "964 Point St.", 
            "98756 Center St.", 
            "35632 Richmond Circle Apt B",
            "2352 Angular Way", 
            "23566 Directive Pl.", 
            "235235 Yaz Blvd.", 
            "7656 Crescent St.", 
            "76543 Moon Ave.", 
            "84533 Hardrock St.", 
            "5687534 Jefferson Way",
            "346346 Blue Pl.", 
            "23423 Adams St.", 
            "633 Main St.", 
        };

        static string[] citiesStates = 
        { 
            "Phoenix,AZ", 
            "Encinitas,CA", 
            "Seattle,WA", 
            "Chandler,AZ", 
            "Dallas,TX", 
            "Orlando,FL", 
            "Carey,NC", 
            "Anaheim,CA", 
            "Dallas,TX", 
            "New York,NY",
            "White Plains,NY",
            "Las Vegas,NV",
            "Los Angeles,CA",
            "Portland,OR",
            "Seattle,WA",
            "Houston,TX",
            "Chicago,IL",
            "Atlanta,GA",
            "Chandler,AZ",
            "Buffalo,NY",
            "Albuquerque,AZ",
            "Boise,ID",
            "Salt Lake City,UT",
        };

        static List<State> states = new List<State> {
            new State { Name="Alabama", Abbreviation="AL"},
            new State { Name=" Montana", Abbreviation="MT"},
            new State { Name=" Alaska", Abbreviation="AK"},
            new State { Name=" Nebraska", Abbreviation="NE"},
            new State { Name=" Arizona", Abbreviation="AZ"},
            new State { Name=" Nevada", Abbreviation="NV"},
            new State { Name="Arkansas", Abbreviation="AR"},
            new State { Name=" New Hampshire", Abbreviation="NH"},
            new State { Name="California", Abbreviation="CA"},
            new State { Name="New Jersey", Abbreviation="NJ"},
            new State { Name="Colorado", Abbreviation="CO"}, 
            new State { Name="New Mexico", Abbreviation="NM"},
            new State { Name="Connecticut", Abbreviation="CT"}, 
            new State { Name="New York", Abbreviation="NY"},
            new State { Name="Delaware", Abbreviation="DE"},
            new State { Name="North Carolina", Abbreviation="NC"},
            new State { Name="Florida", Abbreviation="FL"},
            new State { Name="North Dakota", Abbreviation="ND"},
            new State { Name="Georgia", Abbreviation="GA"}, 
            new State { Name="Ohio", Abbreviation="OH"},
            new State { Name="Hawaii", Abbreviation="HI"},
            new State { Name="Oklahoma", Abbreviation="OK"},
            new State { Name="Idaho", Abbreviation="ID"}, 
            new State { Name="Oregon", Abbreviation="OR"},
            new State { Name="Illinois", Abbreviation="IL"}, 
            new State { Name="Pennsylvania", Abbreviation="PA"},
            new State { Name="Indiana", Abbreviation="IN"}, 
            new State { Name=" Rhode Island", Abbreviation="RI"},
            new State { Name="Iowa", Abbreviation="IA"}, 
            new State { Name="South Carolina", Abbreviation="SC"},
            new State { Name="Kansas", Abbreviation="KS"}, 
            new State { Name="South Dakota", Abbreviation="SD"},
            new State { Name="Kentucky", Abbreviation="KY"}, 
            new State { Name="Tennessee", Abbreviation="TN"},
            new State { Name="Louisiana", Abbreviation="LA"}, 
            new State { Name="Texas", Abbreviation="TX"},
            new State { Name="Maine", Abbreviation="ME"}, 
            new State { Name="Utah", Abbreviation="UT"},
            new State { Name="Maryland", Abbreviation="MD"}, 
            new State { Name="Vermont", Abbreviation="VT"},
            new State { Name="Massachusetts", Abbreviation="MA"}, 
            new State { Name="Virginia", Abbreviation="VA"},
            new State { Name="Michigan", Abbreviation="MI"}, 
            new State { Name="Washington", Abbreviation="WA"},
            new State { Name="Minnesota", Abbreviation="MN"}, 
            new State { Name="West Virginia", Abbreviation="WV"},
            new State { Name="Mississippi", Abbreviation="MS"}, 
            new State { Name="Wisconsin", Abbreviation="WI"},
            new State { Name="Missouri", Abbreviation="MO"}, 
            new State { Name="Wyoming", Abbreviation="WY"}
        };

        static int zip = 85229;

        static List<Order> orders = new List<Order> 
        {
            new Order { Product = "Basket", Type = "Stationary", Price =  29.99M , Quantity=  1},
            new Order { Product = "Needles", Type = "Stationary", Price =  5.99M, Quantity=  1 },
            new Order { Product = "Speakers", Type = "Electornics", Price = 499.99M, Quantity =  1 },
            new Order { Product = "iPod", Type = "Electornics", Price =  399.99M, Quantity=  1 },
            new Order { Product = "Table", Type = "Furniture", Price =  329.99M, Quantity=  1 },
            new Order { Product = "TUTORING IN YOUR HOME", Type = "Services", Price =  129.99M, Quantity=  4 },
            new Order { Product = "Lamp", Type = "Furniture", Price =  89.99M, Quantity=  5 },
            new Order { Product = "Phone", Type = "Electornics", Price =  599.99M, Quantity=  1},
            new Order { Product = "Controller", Type = "Electornics", Price =  49.99M, Quantity=  1},
            new Order { Product = "Pen", Type = "Stationary", Price =  0.99M, Quantity=  1 },
            new Order { Product = "Lego City", Type = "Stationary", Price =  49.99M, Quantity=  1 },
            new Order { Product = "UCR Math major offering math tutoring", Type = "Services", Price =  9.99M, Quantity=  5 },
            new Order { Product = "Glove", Type = "Stationary", Price =  99.99M, Quantity=  1 },
            new Order { Product = "Monitor", Type = "Electornics", Price =  199.99M, Quantity=  2 },
            new Order { Product = "Camera", Type = "Electornics", Price =  499.99M, Quantity=  1 },
            new Order { Product = "Picture Frame", Type = "Stationary", Price =  19.99M, Quantity=  5 }
        };    
    }
}
