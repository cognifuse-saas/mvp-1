# LinkGen Backend

### Overview

LinkGen backend is designed for managing LinkedIn automation campaigns. This README provides setup instructions and API usage details.

### Project Setup

        Prerequisites

        -  Python 3.10+

        -  PostgreSQL

        -  FastAPI
### Clone the Repository

```
git clone git@github.com:cognifuse-saas/mvp-1.git && cd linkgen
```

### Install Dependencies

```
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```
### Set Up Environment Variables

- Create a `.env ` file in the root directory:

  ```
  DB_USER=your_user
  DB_PASSWORD=your_password
  DB_HOST=localhost
  DB_NAME=cognifuse
  ```

### Apply Database Migrations

```
alembic upgrade head
```

### Run the Backend

```
uvicorn fastapi_app.main:app --reload
```

### API Endpoints

Create a Campaign
POST `/api/v1/campaigns/` Request Body:

```
{
  "title": "Black Friday Sale",
  "description": "Huge discounts on all products",
  "start_date": "2025-11-25",
  "end_date": "2025-11-30"
}
```
Get All Campaigns


GET `/api/v1/campaigns/`

Get a Campaign by ID

GET /`api/v1/campaigns/{campaign_id}`


Update a Campaign


PUT `/api/v1/campaigns/{campaign_id}`

```
    {
    "title": "Updated Title",
    "description": "Updated Description"
    }
```
Delete a Campaign


DELETE `/api/v1/campaigns/{campaign_id}`
