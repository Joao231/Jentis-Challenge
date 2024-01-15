# Jentis-Challenge

## Define Book Properties:

* **Title** - String
* **Author** - String
* **ISBN** (The International Standard Book Number) - String
* **Genre** - String
* **Quantity** (stock)- Number
* **Price** - Number
* **Published date** - Date



## API Design:

1. Endpoint for Adding Books:

* Method: POST
* Path: /api/books
* Request Body: JSON with book details (Title, Author, ISBN, Genre, Quantity in stock, Price, Published date)
* Response: Confirmation message or error

2. Endpoint for Deleting Books:
* Method: DELETE
* Path: /api/books/{bookId}
* Response: Confirmation message or error

3. Endpoint for Retrieving Books:
* Method: GET
* Path: /api/books
* Response: List of books or error

4. Endpoint for adding stock to a specific Book when a delivery is made:
* Method: PATCH
* Path: /api/books/deliver/{bookId}
* Request Body: JSON with book quantity deliver
* Response: Json resource with a success message and the updated book resource or failed message

5. Endpoint for deleting stock to a specific Book when a sell is made:
* Method: PATCH
* Path: /api/books/sell/{bookId}
* Request Body: JSON with book quantity sold
* Response: Json with a success message and the updated book resource or failed message



## Interface Documentation for service-notifier:
Document the data structure that the service-notifier will receive for notifications. This could include information like book title, ISBN, and the notification message.
* Type: Cron Job
* Function: checkBookQuantity
* Logic: For each book, it will see if its quantity is less or equal than a specific number of stock, i.e. 10. If so, then make a request to the service-notifier
endpoint using a Notification JSON Format message

Notification JSON Format message:
- Book Title

- Quantity Left

- Notification Message



## Thoughts on Future Improvements:

**Authentication & Authorization**:

Implement user authentication and authorization to secure API endpoints.

**Logging & Monitoring**:

Integrate logging mechanisms for error tracking and monitoring tools for performance analysis.

**Pagination** and **Search Functionality**:

Implement pagination for the /api/books endpoint in case of a large number of books. Include search functionality for finding books based on different criteria.

**Validation and Error Handling**:

Enhance input validation and error handling for robustness.

**Webhooks**:

Instead of a pull mechanism for stock notifications, consider adding webhooks for real-time updates to the service-notifier.



## Ticket/Epic Description Feedback:

**Database Integration**:

The challenge does not specify the database to be used. Clarification on the database choice would be beneficial.

**Error Responses**:

Clarification on the format of error responses from the API would be helpful.

**Scalability Considerations**:

Discussion on potential scalability requirements and strategies.

**Notification process**:

The challenge does not clarify how this notification would happen. We can use webhooks, cron jobs or even use a publish/subscribe system where our service would
publish a message to a topic and then the service-notifier would subscribe to that topic and consume the message.

**Final answer**:

The challenge description is quite comprehensive. However, it would be beneficial to clarify whether there are any specific requirements for database integration, 
error handling in the API and how the notification service could be processed. 
Additionally, consider including information about the expected scale of the application and any specific performance considerations. This would help in making 
more informed design decisions.


