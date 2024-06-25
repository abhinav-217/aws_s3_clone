A amazon aws s3 bucket clone

How to run 

```
  git clone https://github.com/abhinav-217/aws_s3_clone.git
```
Intall the packages
```
  npm install 
```

Run the project
```
  node main.js
```





## API Reference

#### Register

```
  POST /user/register
```

Request body
| key | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `user_name` | `string` | **Required** Your user name |
| `email` | `string` | **Required**. Your email |
| `password` | `string` | **Required**. password |

Example Request body
```
{
    "user_name":"tester",
    "email":"three@gmail.com",
    "password":"1234"
}
```
Example Response
```
{
    "status": true,
    "data": {
        "user_name": "tester",
        "email": "three@gmail.com",
        "password": "1234",
        "token": null,
        "access_token": null,
        "_id": "666ead4a37ffe9eb60b99e84",
        "createdAt": "2024-06-16T09:15:54.681Z",
        "updatedAt": "2024-06-16T09:15:54.681Z",
        "__v": 0
    }
}
```
#### Login

```
  POST /user/login
```

Request body
| key       | Type     | Description            |
| :-------- | :------- | :--------------------- |
| `email`   | `string` | **Required**. Your email |
| `password`| `string` | **Required**. Your password |

Example Request body
```json
{
    "email": "three@gmail.com",
    "password": "1234"
}
```

Example Response
```json
{
    "status": true,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NjZlYWQ0YTM3ZmZlOWViNjBiOTllODQiLCJlbWFpbCI6InRocmVlQGdtYWlsLmNvbSIsImlzX3ZhbGlkX2NsaWVudCI6dHJ1ZSwiaWF0IjoxNzE4NTI5Mzc2fQ.NLIvjn92miOGuYdvBdEBZVHY3LrsEiE7701Z3hHh4NE"
}
```

#### Generate Access Token

```
  POST /user/generate_access_token
```
Access token is used access the files which are in a public bucket

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Example Request Headers
```
auth_key: your_auth_key_here
```

Example Response
```json
{
    "status": true,
    "access_token": "12916ae3-98e6-4389-bb11-b0604643b03f"
}
```

#### Create Bucket
An user can create multiple buckets but bucket name has to be unique 


```
  POST /bucket/create_bucket
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request body
| key           | Type      | Description                  |
| :------------ | :-------- | :--------------------------- |
| `bucket_name` | `string`  | **Required**. Your bucket name |
| `is_public`   | `boolean` | **Required**. Is the bucket public? |
| `access_token`| `string`  | **Required**. Your access token |

Example Request Headers
```
auth_key: your_auth_key_here
```

Example Request body
```json
{
    "bucket_name": "staging",
    "is_public": true,
    "access_token": "cf483082-b34b-4b51-adb0-e5e00be0b19f"
}
```

Example Response
```json
{
    "status": true,
    "data_saved": {
        "bucket_name": "staging",
        "user_id": "666ead4a37ffe9eb60b99e84",
        "access_token": "cf483082-b34b-4b51-adb0-e5e00be0b19f",
        "is_public": true,
        "_id": "666eb02ed1004fcbcc51db44",
        "createdAt": "2024-06-16T09:28:14.188Z",
        "updatedAt": "2024-06-16T09:28:14.188Z",
        "__v": 0
    }
}
```

#### Get All Buckets

```
  GET /bucket/get_all_buckets
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Example Request Headers
```http
auth_key: your_auth_key_here
```

Example Response
```json
{
    "status": true,
    "bucket_list": [
        {
            "_id": "666eaec837ffe9eb60b99e98",
            "bucket_name": "staging",
            "user_id": "666ead4a37ffe9eb60b99e84",
            "access_token": "cf483082-b34b-4b51-adb0-e5e00be0b19f",
            "is_public": true,
            "createdAt": "2024-06-16T09:22:16.090Z",
            "updatedAt": "2024-06-16T09:22:16.090Z",
            "__v": 0
        },
        {
            "_id": "666eaedd37ffe9eb60b99e9b",
            "bucket_name": "development",
            "user_id": "666ead4a37ffe9eb60b99e84",
            "access_token": "cf483082-b34b-4b51-adb0-e5e00be0b19f",
            "is_public": true,
            "createdAt": "2024-06-16T09:22:37.473Z",
            "updatedAt": "2024-06-16T09:22:37.473Z",
            "__v": 0
        }
    ]
}
```

#### Upload Object

```
  POST /object/upload
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request Form Data
| key           | Type         | Description             |
| :------------ | :----------- | :---------------------- |
| `file`        | `file`       | **Required**. Your file |
| `bucket_name` | `string`     | **Required**. Your bucket name |
| `desc`        | `string`     | **Optional**. File description |


Example Response
```json
{
    "status": true,
    "message": "File uploaded successfully",
    "file_details": {
        "filename": "27541718530243149.jpg",
        "ext": ".jpg",
        "bucket_name": "staging",
        "desc": "Video File",
        "file_id": "666eb0c3d1004fcbcc51db60"
    }
}
```

#### Stream File

```
  POST /serve/stream
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request body
| key           | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `bucket_name` | `string` | **Required**. Your bucket name |
| `file_id`     | `string` | **Required**. Your file ID |

Example Request Headers
```
auth_key: your_auth_key_here
```

Example Request body
```json
{
    "bucket_name": "staging",
    "file_id": "666eb0a1d1004fcbcc51db57"
}
```

Example Response
- Binary data of the requested file.

(Note: The response is binary data of the file, not JSON.)

#### Serve File

```
  GET /serve/file
```

Query Parameters
| key            | Type     | Description                  |
| :------------- | :------- | :--------------------------- |
| `bucketName`   | `string` | **Required**. Your bucket name |
| `file_id`      | `string` | **Required**. Your file ID |
| `access_token` | `string` | **Required**. Your access token |

Example URL
```
http://localhost:3000/serve/file?bucketName=staging&file_id=666eb0a1d1004fcbcc51db57&access_token=12916ae3-98e6-4389-bb11-b0604643b03f
```

Example Response
- The file is served in the browser.

(Note: The response is the file being served directly in the browser, not JSON.)

#### Get Bucket Details
Give's all the objects under one bucket

```
  POST /bucket
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request body
| key           | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `bucket_name` | `string` | **Required**. Your bucket name |

Example Request Headers
```
auth_key: your_auth_key_here
```

Example Request body
```json
{
    "bucket_name": "staging"
}
```

Example Response
```json
{
    "status": true,
    "data": [
        {
            "_id": "666eb099d1004fcbcc51db54",
            "filename": "Hellow rold1718530201922.txt",
            "file_url": "C:\\Users\\hp\\Desktop\\aws_clone\\ClientBuckets\\666ead4a37ffe9eb60b99e84\\staging\\Hellow rold1718530201922.txt",
            "ext": ".txt",
            "bucket_name": "staging",
            "desc": "Video File",
            "createdAt": "2024-06-16T09:30:01.927Z",
            "updatedAt": "2024-06-16T09:30:01.927Z",
            "__v": 0
        },
        {
            "_id": "666eb0a1d1004fcbcc51db57",
            "filename": "file_example_MP4_1280_10MG1718530209599.mp4",
            "file_url": "C:\\Users\\hp\\Desktop\\aws_clone\\ClientBuckets\\666ead4a37ffe9eb60b99e84\\staging\\file_example_MP4_1280_10MG1718530209599.mp4",
            "ext": ".mp4",
            "bucket_name": "staging",
            "desc": "Video File",
            "createdAt": "2024-06-16T09:30:09.610Z",
            "updatedAt": "2024-06-16T09:30:09.610Z",
            "__v": 0
        },
        {
            "_id": "666eb0add1004fcbcc51db5a",
            "filename": "file1718530221785.docx",
            "file_url": "C:\\Users\\hp\\Desktop\\aws_clone\\ClientBuckets\\666ead4a37ffe9eb60b99e84\\staging\\file1718530221785.docx",
            "ext": ".docx",
            "bucket_name": "staging",
            "desc": "Video File",
            "createdAt": "2024-06-16T09:30:21.798Z",
            "updatedAt": "2024-06-16T09:30:21.798Z",
            "__v": 0
        }
    ]
}
```

#### Delete Bucket

```
  POST /bucket/delete
```
Delete's the bucket and all the objects inside it
Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request body
| key           | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `bucket_name` | `string` | **Required**. The name of the bucket to delete |

Example Request Headers
```http
auth_key: your_auth_key_here
```

Example Request body
```json
{
    "bucket_name": "delete_testing"
}
```

Example Response
```json
{
    "status": true
}
```

#### Delete Object

```
  POST /object/delete
```

Request Headers
| key        | Type     | Description             |
| :--------- | :------- | :---------------------- |
| `auth_key` | `string` | **Required**. Your auth key |

Request body
| key           | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `bucket_name` | `string` | **Required**. The name of the bucket |
| `file_id`     | `string` | **Required**. The ID of the file to delete |

Example Request Headers
```http
auth_key: your_auth_key_here
```

Example Request body
```json
{
    "bucket_name": "delete_testing",
    "file_id": "666eb039d1004fcbcc51db47"
}
```

Example Response
```json
{
    "status": true
}
```
