from flask import Flask, make_response, request, jsonify, session
from flask_restful import Resource
from flask_migrate import Migrate
from sqlalchemy.exc import IntegrityError

from config import app, db, api
from models import User, Bathroom, Review

class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)
    
class UserResource(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        return user.to_dict(), 200
# to store user
class CheckSession(Resource):
    def get(self):
        try:
            user = User.query.filter_by(id=session['user_id']).first()
            response = make_response(user.to_dict(), 200)
            return response
        except:
            return {"error": "Please log in"}, 401

class Signup(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")
        try:
            user = User(username=username)
            
            user.password_hash = password
            
            db.session.add(user)
            db.session.commit()

            session["user_id"] = user.id
            
            return user.to_dict(), 201
    
        except IntegrityError:
            return{"error": "Username must be unique"}, 422
        except ValueError as err:
            return{"error": str(err)}, 422


class Logout(Resource):
    def delete(self):
        if session.get("user_id"):
            del session["user_id"]
            return{'message': 'You are not logged in'}, 200
        else:
            return{'error': 'User already logged out'}, 401

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get("username")
        password = data.get("password")

        # does user exist
        user = User.query.filter_by(username=username).first()
        # check is the user's password matches users account
        if user:
            if user.authenticate(password):
                session["user_id"] = user.id
                return user.to_dict(), 200
            else:
                return {"error": "Password is incorrect"}, 422
        else:
            return {"error": "Username not found"}, 422


class Bathrooms(Resource):
    def get(self):
        bathroom = [bathroom.to_dict() for bathroom in Bathroom.query.all()]
        return make_response(bathroom, 200)

    def post(self):
        request_json = request.get_json()

        bathroom_name = request_json.get('bathroom_name')
        street_num = request_json.get('street_num')
        street_name = request_json.get('street_name')
        city = request_json.get('city')
        zip_code = request_json.get('zip_code')

        bathroom = Bathroom(
            bathroom_name=bathroom_name,
            street_num=street_num,
            street_name=street_name,
            city=city,
            zip_code=zip_code
        )

        db.session.add(bathroom)
        db.session.commit()

        return bathroom.to_dict(), 200
    
class BathroomResource(Resource):
    def get(self, id):
        bathrooms = Bathroom.query.filter_by(id=id).first()
        return bathrooms.to_dict(), 200
    
    def delete(self, id):
        bathrooms = Bathroom.query.get(id)
        if not bathrooms:
            return make_response({'message': 'Bathroom not found'}, 404)

        db.session.delete(bathrooms)
        db.session.commit()

        return make_response({'message': 'Bathroom deleted successfully'}, 204 )
    
    def patch(self, id):
        bathrooms= Bathroom.query.filter_by(id=id).first()
        if not bathrooms:
            return make_response({'message': 'Bathroom not found'}, 404)
        request_json = request.get_json()
        for key in request_json:
            setattr(bathrooms,key,request_json[key])
        
        db.session.add(bathrooms)
        db.session.commit()

        return bathrooms.to_dict(), 200

class Reviews(Resource):
    def get(self):
        reviews = [review.to_dict() for review in Review.query.all()]
        return make_response(reviews, 200)

    def post(self):
        request_json = request.get_json()

        content = request_json.get('content')
        user_id = request_json.get('user_id')
        bathroom_id = request_json.get('bathroom_id')

        review = Review(
            content=content,
            user_id=user_id,
            bathroom_id=bathroom_id
        )

        db.session.add(review)
        db.session.commit()

        return make_response(review.to_dict(), 201)


class ReviewsResource(Resource):
    def get(self, id):
        reviews = Review.query.filter_by(id=id).first()
        if not reviews:
            return make_response({'message': 'There are no reviews'}, 404)
            
        return reviews.to_dict(), 200
    
    def patch(self, id):
        request_json = request.get_json()

        review = Review.query.get(id)
        if not review:
            return make_response({'message': 'Review not found'}, 404)

        # Update the review attributes based on the request JSON
        review.content = request_json.get('content')

        db.session.commit()

        return make_response({'message': 'Review updated successfully'}, 200)

    def delete(self, id):
        review = Review.query.get(id)
        if not review:
            return make_response({'message': 'Review not found'}, 404)

        db.session.delete(review)
        db.session.commit()

        return make_response({'message': 'Review deleted successfully'}, 200)



#function is used to associate your resource classes with specific URLs.
api.add_resource(Users, '/users')
api.add_resource(UserResource, '/users/<int:id>')
api.add_resource(Signup, '/signup')
api.add_resource(Logout, '/logout')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Bathrooms, '/bathrooms')
api.add_resource(BathroomResource, '/bathrooms/<int:id>')
api.add_resource(Reviews, '/reviews')
api.add_resource(ReviewsResource, '/reviews/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)



# export FLASK_RUN_PORT=5555