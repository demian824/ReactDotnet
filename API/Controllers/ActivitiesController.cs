using Microsoft.AspNetCore.Mvc;
using Domain;
using Application.Activities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    
    public class ActivitiesController : BaseApiController
    {
        [HttpGet] //api/activities
        public async Task<IActionResult>GetActivities(){
            return HandleResult(await Mediator.Send(new List.Query()));
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult>GetActivity(Guid id){
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }
        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity){
            await Mediator.Send(new Create.Command{Activity = activity} );

            return Ok();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult>EditActivity(Guid id, Activity activity){
            activity.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{ Activity = activity }));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id){
            
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id}));
        }
    }
}