from aiohttp import web
import aiohttp

async def fetch_one():
  async with aiohttp.ClientSession() as session:
    url = 'http://201.6.17.212/AVS/besc?action=GetAggregatedContentDetails&channel=PCTV&version=1.2&contentId=1000001189'
    async with session.get(url) as resp:
      print(resp.status)
      return await resp.json()
        
async def test(request):
  data = await fetch_one()
  return web.json_response(data['resultObj']['contentInfo'])
    
    
app = web.Application()
app.router.add_get('/', test)

web.run_app(app)