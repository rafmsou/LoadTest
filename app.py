import curio
import curio_http
import time

async def fetch_one(url):
    start_time = time.time()

    async with curio_http.ClientSession() as session:
        response = await session.get(url)
        content = await response.json()
        elapsed_time = time.time() - start_time
        print(elapsed_time)
        print(content['resultCode'])
        return response, content


async def main():
    tasks = []

    for i in range(0, 2000):
        url = 'http://201.6.17.212/AVS/besc?action=GetAggregatedContentDetails&channel=PCTV&version=1.2&contentId=1000001189'
        task = await curio.spawn(fetch_one(url))
        tasks.append(task)

    for task in tasks:
        response, content = await task.join()

if __name__ == '__main__':
    curio.run(main())