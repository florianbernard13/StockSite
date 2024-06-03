from flask import Blueprint,request, json
import math

DT_LINEAR_REGRESSION = Blueprint('linear_regression', __name__)

@DT_LINEAR_REGRESSION.route("/data_tools/linear_regression")
def linear_regression():
    data = json.loads(request.args.get('data', default="null"))['Close']
    result = []
    n = len(data)
    y = list(data.values())
    moyenne_x = (n+1)/2
    somme_x = n*moyenne_x
    somme_y = sum(y)
    moyenne_y = somme_y / n
    somme_xy = sum([ (idx+1) * b for idx, b in enumerate(y) ])
    somme_x2 = (n*(n+1)*(2*n+1))/6
    coeff_b = (n*somme_xy - somme_x*somme_y)/(n*somme_x2-somme_x**2)
    coeff_a = moyenne_y - moyenne_x * coeff_b
    standard_dev = math.sqrt((1/n)*(sum([(y_element - moyenne_y)**2 for y_element in y])))
    for i in range(1, n+1):
        result.append(coeff_a + coeff_b * i)
    return json.dumps([result,standard_dev])


    

